import {User} from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import {Post} from "../models/postModel.js";

export const register = async(req,res)=>{
    try{
        const { email, username, password } = req.body;
        if (!email || !username || !password  ) {
            return res.status(400).json({ message: "All fields are required",success:false });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different",success:false });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        await User.create({
            email,
            username,
            password:hashedPassword,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    }catch(error){
     console.log(error)
    }
}

export const login = async(req,res)=>{
    try{
     const {email,password} =req.body;
     if(!email || !password){
        return res.status(400).json({ message: "All fields are required" });
     }
     let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData= {
            userId: user._id
        }
        const populatedPosts = await Promise.all(
            user.posts.map(async(postId)=>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user= {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePhoto:user.profilePhoto,
            about:user.about,
            followers:user.followers,
            following:user.following,
            posts:populatedPosts
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).cookie("token",token,{
            maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'
        }).json({
            message:`Welcome back ${user.username}`,
            success:true,
            user,
        }) 
    }catch(error){
        console.log(error)
    }
}

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers= async(req,res)=>{
    try{
       const loggedInUserId= req.id;
       const otherUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password");
       if(!otherUsers){
        return res.status(400).json({
            message:'Currently do not have any users'
        })
       }
       return res.status(200).json({users:otherUsers,
        success:true,}
       )
    }catch(error){
        console.log(error);
    }
}

export const followOrUnfollow = async (req,res)=>{
    try{
        const followKrneWala = req.id; 
        const jiskoFollowKrunga = req.params.id; 
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    }catch(error){
        console.log(error)
    }
}
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1})
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log('Profile not found',error);
    }
};

export const editProfile= async(req,res)=>{
  try{
    const userId = req.id;
    const { about, gender } = req.body;
    const profilePhoto = req.file;
    let cloudResponse;
    if (profilePhoto) {
        const fileUri = getDataUri(profilePhoto);
        cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password')
    if (!user) {
        return res.status(404).json({
            message: 'User not found.',
            success: false
        });
    };
         if (about) user.about = about;
        if (gender) user.gender = gender;
        if (profilePhoto) user.profilePhoto = cloudResponse.secure_url;
        await user.save()
        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });
  }catch(error){
      console.error(error)
  }
}